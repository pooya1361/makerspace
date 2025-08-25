/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.2.1263 on 2025-08-25 09:28:39.

export interface ActivityCreateDTO {
    id: number;
    name: string;
    description: string;
    workshopId: number;
}

export interface LessonCreateDTO {
    id: number;
    name: string;
    description: string;
    activityId: number;
}

export interface LessonUserCreateDTO {
    id: number;
    lessonId: number;
    userId: number;
    acquired: boolean;
}

export interface ProposedTimeSlotCreateDTO {
    id: number;
    proposedStartTime: Date;
    scheduledLessonId: number;
}

export interface ScheduledLessonCreateDTO {
    id: number;
    startTime?: Date;
    durationInMinutes: number;
    lessonId: number;
    instructorUserId: number;
}

export interface UserCreateDTO {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    userType: UserType;
}

export interface VoteCreateDTO {
    id: number;
    userId: number;
    proposedTimeSlotId: number;
}

export interface WorkshopCreateDTO {
    id: number;
    name: string;
    description: string;
    size: number;
    activityIds: number[];
}

export interface ActivityResponseDTO {
    id: number;
    name: string;
    description: string;
    workshop: WorkshopSummaryDTO;
}

export interface LessonResponseDTO {
    id: number;
    name: string;
    description: string;
    activity: ActivityResponseDTO;
}

export interface LessonUserResponseDTO {
    id: number;
    lesson: LessonResponseDTO;
    user: UserSummaryDTO;
    acquired: boolean;
}

export interface ProposedTimeSlotResponseDTO {
    id: number;
    proposedStartTime: Date;
    scheduledLesson: ScheduledLessonSummaryDTO;
    votes: VoteSummaryDTO[];
}

export interface ScheduledLessonResponseDTO {
    id: number;
    startTime?: Date;
    durationInMinutes: number;
    lesson: LessonResponseDTO;
    instructor: UserResponseDTO;
    proposedTimeSlots: ProposedTimeSlotSummaryDTO[];
}

export interface SummaryResponseDTO {
    totalWorkshops: number;
    totalActivities: number;
    totalLessons: number;
    totalScheduledLessons: number;
    totalUsers: number;
}

export interface UserResponseDTO {
    id: number;
    firstName: string;
    lastName: string;
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
    activities: ActivitySummaryDTO[];
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

export interface LessonUser {
    id: number;
    lesson: Lesson;
    user: User;
    acquired: boolean;
}

export interface ProposedTimeSlot {
    id: number;
    proposedStartTime: Date;
    scheduledLesson: ScheduledLesson;
    createdAt: Date;
}

export interface ScheduledLesson {
    id: number;
    startTime?: Date;
    durationInMinutes: number;
    lesson: Lesson;
    instructor: User;
    proposedTimeSlots: ProposedTimeSlot[];
}

export interface User extends UserDetails {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
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
    activities: Activity[];
}

export interface WorkshopSummaryDTO {
    id: number;
    name: string;
    description: string;
    size: number;
}

export interface UserSummaryDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    userType: UserType;
}

export interface ScheduledLessonSummaryDTO {
    id: number;
    startTime?: Date;
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

export interface ActivitySummaryDTO {
    id: number;
    name: string;
    description: string;
}

export interface GrantedAuthority extends Serializable {
    authority: string;
}

export interface UserDetails extends Serializable {
    password: string;
    enabled: boolean;
    username: string;
    authorities: GrantedAuthority[];
    accountNonLocked: boolean;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
}

export interface Serializable {
}

export type UserType = "NORMAL" | "INSTRUCTOR" | "ADMIN" | "SUPERADMIN";
