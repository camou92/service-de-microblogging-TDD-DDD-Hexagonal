import { beforeEach, describe, expect, test } from "@jest/globals";
import { createMessageFixture, MessagingFixture } from "./messaging.fixture";
import { messageBuilder } from "./message.builder";
import { EmptyMessageError, MessageTooLongError } from "../domain/message";

describe("Feature: editing a message", () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessageFixture();
  });

  describe("Rule: The edited text should not be superior to 200 characters", () => {
    test("Alice can edit her message to a text inferior to 280 characters", async () => {
      const aliceMessageBuilder = messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Hello Wrld");
      fixture.givenTheFollowingMessagesExist([aliceMessageBuilder.build()]);

      await fixture.whenUserEditsMessage({
        messageId: "message-id",
        text: "Hello World",
      });

      await fixture.thenMessageShouldBe(
        aliceMessageBuilder.withText("Hello World").build(),
      );
    });

    test("Alice cannot edit her message to a text superior to 280 characters", async () => {
      const textWithLengthOf281 =
        "Développeur passionné, je progresse chaque jour en backend TypeScript avec NestJS et Express, tout en explorant le frontend pour devenir fullstack. Curieux, rigoureux et motivé, j’aime apprendre, partager et construire des solutions utiles et évolutives. Toujours orienté qualité.!";
      const originalAliceMessage = messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Hello World")
        .build();
      fixture.givenTheFollowingMessagesExist([originalAliceMessage]);

      await fixture.whenUserEditsMessage({
        messageId: "message-id",
        text: textWithLengthOf281,
      });

      await fixture.thenMessageShouldBe(originalAliceMessage);
      fixture.thenErrorShouldBe(MessageTooLongError);
    });

    test("Alice cannot edit her message to an empty text", async () => {
      const originalAliceMessage = messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Hello World")
        .build();
      fixture.givenTheFollowingMessagesExist([originalAliceMessage]);

      await fixture.whenUserEditsMessage({
        messageId: "message-id",
        text: "",
      });

      await fixture.thenMessageShouldBe(originalAliceMessage);
      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});
