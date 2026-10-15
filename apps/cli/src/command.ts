import { Command, CommandRunner } from 'nest-commander';
import {
  PostMessageCommand,
  PostMessageUseCase,
} from '@app/crafty/application/usecase/post-message.usecase';
import {
  EditMessageCommand,
  EditMessageUseCase,
} from '@app/crafty/application/usecase/edit-message.usecase';
import {
  FollowUserCommand,
  FollowUserUseCase,
} from '@app/crafty/application/usecase/follow-user.usecase';
import { CliTimelinePresenter } from './cli.timeline.presenter';
import { ViewTimelineUseCase } from '@app/crafty/application/usecase/view-timeline.usecase';
import { ViewWallUseCase} from "@app/crafty/application/usecase/view-wall.usecase"

@Command({ name: 'post', arguments: '<user> <message>' })
class PostCommand extends CommandRunner {
  constructor(private readonly postMessageUseCase: PostMessageUseCase) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const postMessageCommand: PostMessageCommand = {
      id: Math.floor(Math.random() * 1000).toString(),
      author: passedParams[0],
      text: passedParams[1],
    };
    try {
      await this.postMessageUseCase.handle(postMessageCommand);
      console.log('Message posté');
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}

@Command({ name: 'edit', arguments: '<user> <message-id>' })
class EditCommand extends CommandRunner {
  constructor(private readonly editMessageUseCase: EditMessageUseCase) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const editMessageCommand: EditMessageCommand = {
      messageId: passedParams[1],
      text: passedParams[2],
    };
    try {
      await this.editMessageUseCase.handle(editMessageCommand);
      console.log('Message eité');
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}

@Command({ name: 'follow', arguments: '<user> <followee>' })
class FollowCommand extends CommandRunner {
  constructor(private readonly followUserUseCase: FollowUserUseCase) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const followUserCommand: FollowUserCommand = {
      user: passedParams[0],
      userToFollow: passedParams[1],
    };
    try {
      await this.followUserUseCase.handle(followUserCommand);
      console.log(`Tu suis maintenant ${passedParams[1]}`);
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}

@Command({ name: 'view', arguments: '<user>' })
class ViewCommand extends CommandRunner {
  constructor(
    private readonly cliPresenter: CliTimelinePresenter,
    private readonly viewTimelineUseCase: ViewTimelineUseCase,
  ) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    try {
      await this.viewTimelineUseCase.handle(
        { user: passedParams[0] },
        this.cliPresenter,
      );
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}

@Command({ name: 'wall', arguments: '<user>' })
class WallCommand extends CommandRunner {
  constructor(
    private readonly cliPresenter: CliTimelinePresenter,
    private readonly viewWallUseCase: ViewWallUseCase,
  ) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    try {
      await this.viewWallUseCase.handle(
        { user: passedParams[0] },
        this.cliPresenter,
      );
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}

export const commands = [
    PostCommand,
    EditCommand,
    FollowCommand,
    ViewCommand,
    WallCommand
]
