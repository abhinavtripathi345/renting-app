import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, SubmitVerificationDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        providerProfile: true,
        _count: {
          select: {
            customerBookings: true,
            reviews: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User profile not found');
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { ...dto },
      include: { providerProfile: true },
    });
    return {
      success: true,
      message: 'Profile updated successfully',
      user,
    };
  }

  async submitVerificationDocuments(userId: string, dto: SubmitVerificationDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        verificationStatus: 'PENDING', // moves from UNVERIFIED/REJECTED to PENDING for admin review
      },
    });

    // Create system notification
    await this.prisma.notification.create({
      data: {
        userId,
        title: 'Verification Under Review',
        message: 'Your driving license and verification documents have been submitted for admin approval.',
        type: 'VERIFICATION',
      },
    });

    return {
      success: true,
      message: 'Verification documents submitted successfully. Verification status is now PENDING.',
      user: updatedUser,
    };
  }

  async getVerificationStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        verificationStatus: true,
        drivingLicenseNo: true,
        dlExpiryDate: true,
        dlFrontUrl: true,
        dlBackUrl: true,
        aadhaarNo: true,
        aadhaarDocUrl: true,
        verificationNote: true,
        verifiedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isEligibleToBook = user.verificationStatus === 'VERIFIED' || user.verificationStatus === 'PENDING';

    return {
      success: true,
      status: user.verificationStatus,
      isVerified: user.verificationStatus === 'VERIFIED',
      isPending: user.verificationStatus === 'PENDING',
      isEligibleToBook,
      details: user,
    };
  }
}
