import { beforeEach, describe, expect, test } from "@jest/globals";
import { createMessageFixture, MessagingFixture } from "./messaging.fixture";
import { messageBuilder } from "./message.builder";
import { EmptyMessageError, MessageTooLongError } from "../domain/message";

describe("Feature: Posting a message", () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessageFixture();
  });
  describe("Rule: A message can contain a maximum of 280 characters", () => {
    test("Alice can a message on her timeline", async () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      await fixture.whenUserPostsAmessage({
        id: "message-id",
        text: "Hello World",
        author: "Alice",
      });

      await fixture.thenMessageShouldBe(
        messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Hello World")
        .publishedAt(new Date("2023-01-19T19:00:00.000Z")).build()
        );
    });

    test("Alice cannot post a message with more than 280 characters", async () => {
      const textWithLengthOf281 =
        "Développeur passionné, je progresse chaque jour en backend TypeScript avec NestJS et Express, tout en explorant le frontend pour devenir fullstack. Curieux, rigoureux et motivé, j’aime apprendre, partager et construire des solutions utiles et évolutives. Toujours orienté qualité.!";
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      await fixture.whenUserPostsAmessage({
        id: "message-id",
        author: "Alice",
        text: textWithLengthOf281,
      });

      fixture.thenErrorShouldBe(MessageTooLongError);
    });
  });

  describe("Rule: A message cannot be empty", () => {
    test("Alice cannot post an empty message", async () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      await fixture.whenUserPostsAmessage({
        id: "message-id",
        author: "Alice",
        text: "",
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });
    test("Alice cannot post an message with only whitespaces", async () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      await fixture.whenUserPostsAmessage({
        id: "message-id",
        author: "Alice",
        text: "   ",
      });
      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});
