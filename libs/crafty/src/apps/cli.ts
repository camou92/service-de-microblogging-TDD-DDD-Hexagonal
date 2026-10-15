#!/usr/bin/env node
import { Command } from "commander";

import { DateProvider } from "../application/date-provider";
import { ViewTimelineUseCase } from "../application/usecase/view-timeline.usecase";
import { EditMessageCommand, EditMessageUseCase } from "../application/usecase/edit-message.usecase";
import { PostMessageCommand, PostMessageUseCase } from "../application/usecase/post-message.usecase";
import { FollowUserCommand, FollowUserUseCase } from "../application/usecase/follow-user.usecase";
import { ViewWallUseCase } from "../application/usecase/view-wall.usecase";
import { PrismaClient } from "@prisma/client";
import { PrismaMessageRepository } from "../infra/message.prisma.repository";
import { PrimaFolloweeRepository } from "../infra/followee.prisma.repository";
import { TimelinePresenter } from "../application/timeline.presenter";
import { DefaultTimelinePresenter } from "./timeline.default.presenter";
import { Timeline } from "../domain/timeline";

class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}

class CliTimelinePresenter implements TimelinePresenter {
  constructor(
    private readonly defaultTimelinePresenter: DefaultTimelinePresenter
  ) {}

  show(timeline: Timeline): void {
    console.log(this.defaultTimelinePresenter.show(timeline))
  }
}

const prismaClient = new PrismaClient()
const messageRepository = new PrismaMessageRepository(prismaClient);
const followeeRepository = new PrimaFolloweeRepository(prismaClient)
const dateProvider = new RealDateProvider();
const defaultTimelinePresenter = new DefaultTimelinePresenter(dateProvider)
const timelinePresenter = new CliTimelinePresenter(defaultTimelinePresenter)
const viewWallUseCase = new ViewWallUseCase(
  messageRepository,
  followeeRepository,
)
const viewTimelineUseCase = new ViewTimelineUseCase(
  messageRepository,
  dateProvider,
);
const editMessageUseCase = new EditMessageUseCase(messageRepository);
const followUserUseCase = new FollowUserUseCase(followeeRepository)
const postMessageUseCase = new PostMessageUseCase(
  messageRepository,
  dateProvider,
);
const program = new Command();

program
  .version("1.0.0")
  .description("Crafty social network")
  .addCommand(
    new Command("post")
      .argument("<user>", "the current user")
      .argument("<message>", "the message to post")
      .action(async (user, message) => {
        const postMessageCommand: PostMessageCommand = {
          id: `${Math.floor(Math.random() * 1000)}`,
          author: user,
          text: message,
        };
        try {
          await postMessageUseCase.handle(postMessageCommand);
          console.log("✅ Message posté");
        } catch (err) {
          console.error("❌", err);
        }
      }),
  )

  .addCommand(
    new Command("view")
      .argument("<user>", "the user to view the timeline of")
      .action(async (user) => {
        try {
          const timeline = await viewTimelineUseCase.handle({ user }, timelinePresenter);
          console.table(timeline);
          process.exit(0);
        } catch (err) {
          console.log(err);
          process.exit(1);
        }
      }),
  )

  .addCommand(
    new Command("wall")
      .argument("<user>", "the user to view the wall of")
      .action(async (user) => {
        try {
          const timeline = await viewWallUseCase.handle({ user }, timelinePresenter);
          console.table(timeline);
          process.exit(0);
        } catch (err) {
          console.log(err);
          process.exit(1);
        }
      }),
  )

  .addCommand(
    new Command("edit")
      .argument("<message-id>", "the message id of the message to edit")
      .argument("<message>", "the new text")
      .action(async (messageId, message) => {
        const editMessageCommand: EditMessageCommand = {
          messageId,
          text: message,
        };
        try {
          await editMessageUseCase.handle(editMessageCommand);
          console.log("✅ Message edité");
        } catch (err) {
          console.error("❌", err);
        }
      }),
  )

  .addCommand(
    new Command("follow")
      .argument("<user>", "the current user")
      .argument("<user-to-follow>", "the user to follow")
      .action(async (user, userToFollow) => {
        const followUserCommand: FollowUserCommand = {
          user,
          userToFollow,
        };
        try {
          await followUserUseCase.handle(followUserCommand);
          console.log(`✅ Tu suis maintenant ${userToFollow}`);
        } catch (err) {
          console.error("❌", err);
        }
      }),
  );

async function main() {
  await prismaClient.$connect()
  await program.parseAsync();
  await prismaClient.$connect()
}

main();
