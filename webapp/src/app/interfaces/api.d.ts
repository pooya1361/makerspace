/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2025-07-17 17:12:17.

export interface ActivityCreateDTO {
    name: string;
    description: string;
    workshopId: number;
}

export interface LessonCreateDTO {
    name: string;
    description: string;
    activityId: number;
}

export interface ProposedTimeSlotCreateDTO {
    proposedStartTime: Date;
    scheduledLessonId: number;
}

export interface ScheduledLessonCreateDTO {
    durationInMinutes: number;
    lessonId: number;
    instructorUserId: number;
}

export interface UserCreateDTO {
    username: string;
    password: string;
    email: string;
    userType: UserType;
}

export interface VoteCreateDTO {
    userId: number;
    proposedTimeSlotId: number;
}

export interface WorkshopCreateDTO {
    name: string;
    description: string;
    size: number;
}

export interface ActivityResponseDTO {
    id: number;
    name: string;
    description: string;
    workshop: WorkshopResponseDTO;
}

export interface LessonResponseDTO {
    id: number;
    name: string;
    description: string;
    activity: ActivityResponseDTO;
}

export interface ProposedTimeSlotResponseDTO {
    id: number;
    proposedStartTime: Date;
    scheduledLesson: ScheduledLessonSummaryDTO;
    votes: VoteSummaryDTO[];
}

export interface ScheduledLessonResponseDTO {
    id: number;
    startTime: Date;
    durationInMinutes: number;
    lesson: LessonResponseDTO;
    instructor: UserResponseDTO;
    proposedTimeSlots: ProposedTimeSlotSummaryDTO[];
}

export interface UserResponseDTO {
    id: number;
    username: string;
    email: string;
    userType: UserType;
}

export interface VoteResponseDTO {
    id: number;
    proposedTimeSlot: ProposedTimeSlotSummaryDTO;
    user: UserSummaryDTO;
}

export interface WorkshopResponseDTO {
    id: number;
    name: string;
    description: string;
    size: number;
}

export interface Activity {
    id: number;
    name: string;
    description: string;
    workshop: Workshop;
}

export interface Lesson {
    id: number;
    name: string;
    description: string;
    activity: Activity;
}

export interface ProposedTimeSlot {
    id: number;
    proposedStartTime: Date;
    scheduledLesson: ScheduledLesson;
}

export interface ScheduledLesson {
    id: number;
    startTime?: Date;
    durationInMinutes: number;
    lesson: Lesson;
    instructor: User;
    proposedTimeSlots: ProposedTimeSlot[];
}

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    userType: UserType;
}

export interface Vote {
    id: number;
    proposedTimeSlot: ProposedTimeSlot;
    user: User;
}

export interface Workshop {
    id: number;
    name: string;
    description: string;
    size: number;
}

export interface ScheduledLessonSummaryDTO {
    id: number;
    startTime: Date;
    durationInMinutes: number;
    lesson: LessonResponseDTO;
    instructor: UserSummaryDTO;
}

export interface VoteSummaryDTO {
    id: number;
    user: UserSummaryDTO;
}

export interface ProposedTimeSlotSummaryDTO {
    id: number;
    proposedStartTime: Date;
    votes: VoteSummaryDTO[];
}

export interface UserSummaryDTO {
    id: number;
    username: string;
    email: string;
    userType: UserType;
}

export type UserType = "NORMAL" | "MODERATOR" | "ADMIN" | "SUPERADMIN";
