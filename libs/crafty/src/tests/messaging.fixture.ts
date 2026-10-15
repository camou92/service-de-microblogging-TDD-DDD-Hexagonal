import { expect } from "@jest/globals";
import { Message } from "../domain/message";
import {
  PostMessageCommand,
  PostMessageUseCase,
} from "../application/usecase/post-message.usecase";
import { StubDateProvider } from "../infra/stub-date-provider";
import { ViewTimelineUseCase } from "../application/usecase/view-timeline.usecase";
import { EditMessageCommand, EditMessageUseCase } from "../application/usecase/edit-message.usecase";
import { DefaultTimelinePresenter } from "../apps/timeline.default.presenter";
import { TimelinePresenter } from "../application/timeline.presenter";
import { PrismaMessageRepository} from "../infra/prisma/message.prisma.repository"
import { InMemoryMessageRepository } from "../infra/message.inmemory.repository";

export const createMessageFixture = () => {
  let timeline!: {
    author: string;
    text: string;
    publicationTime: string;
  }[];
  const dateProvider = new StubDateProvider();
  const messageRepository = new InMemoryMessageRepository();
  const editMessageUseCase = new EditMessageUseCase(messageRepository)
  const viewTimelineUseCase = new ViewTimelineUseCase(
    messageRepository,
  );
  const defaultTimelinePresenter = new DefaultTimelinePresenter(dateProvider)
  const timelinePresenter: TimelinePresenter = {
    show(theTimeline) {
      timeline = defaultTimelinePresenter.show(theTimeline)
    }
  }

  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider,
  );
  let thrownError: unknown;

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    async whenUserPostsAmessage(postMessageCommand: PostMessageCommand) {
      try {
        await postMessageUseCase.handle(postMessageCommand);
      } catch (err) {
        thrownError = err;
      }
    },
    async whenUserEditsMessage(editMessageCommand: EditMessageCommand) {
      try {
        await editMessageUseCase.handle(editMessageCommand)
      } catch (err) {
        thrownError = err;
      }
    },
    async thenMessageShouldBe(expectedMessage: Message) {
      const message = await messageRepository.getById(expectedMessage.id)
      expect(expectedMessage).toEqual(expectedMessage)
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
    givenTheFollowingMessagesExist(messages: Message[]) {
      messageRepository.givenExistingMessages(messages);
    },
    async whenUserSeesTheTimelineOf(user: string) {
      await viewTimelineUseCase.handle({ user }, timelinePresenter)
    },
    thenUserShouldSee(
      expectedTimeline: {
        author: string;
        text: string;
        publicationTime: string;
      }[],
    ) {
      expect(timeline).toEqual(expectedTimeline);
    },
    messageRepository
  };
};

export type MessagingFixture = ReturnType<typeof createMessageFixture>
