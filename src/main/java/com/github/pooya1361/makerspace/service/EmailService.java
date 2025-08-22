package com.github.pooya1361.makerspace.service;

import com.github.pooya1361.makerspace.model.ProposedTimeSlot;
import com.github.pooya1361.makerspace.model.ScheduledLesson;
import com.github.pooya1361.makerspace.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.from:noreply@makerspace.com}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendNewScheduledLessonNotification(User user, ScheduledLesson scheduledLesson, ProposedTimeSlot proposedTimeSlot) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("New lesson scheduled for " + scheduledLesson.getLesson().getName());

            String emailContent = String.format("""
                            <html>
                            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                                <div style="max-width: 600px;">
                                    <h2 style="color: #2c3e50;">New Time Slot Proposed!</h2>
                                   \s
                                    <p>Hi %s,</p>
                                   \s
                                    <p>A lesson has been scheduled for <strong>%s</strong>.</p>
                                   \s
                                    <p>Please click on the link below and vote on the available time slots:</p>
                                    <p style="text-align: center;">
                                        <a href="%s/scheduled-lessons/%d"\s
                                           style="background: #007bff; color: white; padding: 12px 25px;\s
                                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                                           Vote on Time Slots
                                        </a>
                                    </p>
                                   \s
                                    <p>If you're no longer interested in this lesson, you can remove this lesson from your interested list\s
                                       <a href="%s/lessons">here</a>.</p>
                                   \s
                                    <p>Best regards,<br>
                                    <strong>Fake Makerspace Team (Pouya)</strong></p>
                                </div>
                            </body>
                            </html>
                            """,
                    user.getFirstName() != null ? user.getFirstName() : "Student",
                    scheduledLesson.getLesson().getName(),
                    frontendUrl,
                    scheduledLesson.getId(),
                    frontendUrl
            );

            helper.setText(emailContent, true);
            mailSender.send(message);

            log.info("Email sent to {} for time slot {}", user.getEmail(), proposedTimeSlot.getId());
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}