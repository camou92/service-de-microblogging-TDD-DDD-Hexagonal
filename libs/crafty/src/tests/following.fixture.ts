import {expect} from "@jest/globals"

import { FollowUserCommand, FollowUserUseCase } from "../application/usecase/follow-user.usecase";
import { InMemoryFolloweeRepository } from "../infra/followee.inmemory.repository";

export const createFollowingFixture = () => {
    const followeeRepository = new InMemoryFolloweeRepository();
    const followUserCase = new FollowUserUseCase(followeeRepository);
  return {
    givenUserFollowers({
      user,
      followees,
    }: {
      user: string;
      followees: string[];
    }) {
        followeeRepository.givenExistingFollowees(
            followees.map((f) => ({
                user,
                followee: f
            }))
        )
    },

    async whenUserFollows(followUserCommand: FollowUserCommand) {
        await followUserCase.handle(followUserCommand)
    },

    async thenUserFolloweesAre(userFollowees: {
      user: string;
      followees: string[];
    }) {
        const actualFollowees = await followeeRepository.getFolloweesOf(userFollowees.user)

        expect(actualFollowees).toEqual(userFollowees.followees)
    },
    followeeRepository
  };
};

export type FollowingFixture = ReturnType<typeof createFollowingFixture>;
