import { beforeEach, describe, expect, it, test, xtest } from "@jest/globals";
import { createMessageFixture, MessagingFixture } from "./messaging.fixture";
import { messageBuilder } from "./message.builder";
describe("Feature: Viewing a personal timeline", () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessageFixture();
  });

  describe("Rule: Messages are shown in reverse chronological order", () => {
    test("Alice can view the 2 messages she published in her timeline", async () => {
      const aliceMessageBuilder = messageBuilder().authoredBy("Alice");
      
      fixture.givenTheFollowingMessagesExist([
        aliceMessageBuilder
          .withId("message-1")
          .withText("My first message")
          .publishedAt(new Date("2026-09-19T16:28:00.000Z"))
          .build(),
        messageBuilder()
          .authoredBy("Bob")
          .withId("message-2")
          .withText("Hi it's Bob")
          .publishedAt(new Date("2026-09-19T16:29:00.000Z"))
          .build(),
        aliceMessageBuilder
          .withId("message-3")
          .withText("How are you all ?")
          .publishedAt(new Date("2026-09-19T16:30:00.000Z"))
          .build(),
        aliceMessageBuilder
          .withId("message-4")
          .withText("My last message")
          .publishedAt(new Date("2026-09-19T16:30:30.000Z"))
          .build(),
      ]);
      fixture.givenNowIs(new Date("2026-09-19T16:31:00.000Z"));

      await fixture.whenUserSeesTheTimelineOf("Alice");

      fixture.thenUserShouldSee([
        {
          author: "Alice",
          text: "My last message",
          publicationTime: "less than a minute ago",
        },
        {
          author: "Alice",
          text: "How are you all ?",
          publicationTime: "1 minute ago",
        },
        {
          author: "Alice",
          text: "My first message",
          publicationTime: "3 minutes ago",
        },
      ]);
    });
  });

  const publicationTime = (now: Date, publishedAt: Date) => {
    const diff = now.getTime() - publishedAt.getTime();
    const minutes = diff / 60000;
    if (minutes < 1) {
      return "less than a minute ago";
    }
    if (minutes < 2) {
      return "1 minute ago";
    }
    return `${minutes} minutes ago`;
  };

  /* describe("publicationTime", () => {
    it("should return 'less than a minute ago' when the publication date is exactly one minute ago", () => {
      const now = new Date("2026-09-16T10:57:00.000Z");
      const publishedAt = new Date("2026-09-16T10:56:30.000Z");

      const text = publicationTime(now, publishedAt);

      expect(text).toEqual("less than a minute ago");
    });

    it("should return '1 minute ago' when the publication date is inferior to one minute ago", () => {
      const now = new Date("2026-09-16T10:57:00.000Z");
      const publishedAt = new Date("2026-09-16T10:56:00.000Z");

      const text = publicationTime(now, publishedAt);

      expect(text).toEqual("1 minute ago");
    });

    it("should return '1 minute ago' when the publication date is exactly under 2 minutes ago", () => {
      const now = new Date("2026-09-16T10:57:00.000Z");
      const publishedAt = new Date("2026-09-16T10:55:01.000Z");

      const text = publicationTime(now, publishedAt);

      expect(text).toEqual("1 minute ago");
    });

    it("should return '2 minutes ago' when the publication date is between 2 minutes ago and 2 minutes 59 seconds ago", () => {
      const now = new Date("2026-09-16T10:57:00.000Z");
      const publishedAt = new Date("2026-09-16T10:55:00.000Z");

      const text = publicationTime(now, publishedAt);

      expect(text).toEqual("2 minutes ago");
    });

    it("should return 'X minutes ago' when the publication date is exactly between X minutes and X minutes 59 seconds ago", () => {
      const now = new Date("2026-09-16T10:57:00.000Z");
      const publishedAt = new Date("2026-09-16T10:55:00.000Z");

      const text = publicationTime(now, publishedAt);

      expect(text).toEqual("2 minutes ago");
    });
  }); */
});
