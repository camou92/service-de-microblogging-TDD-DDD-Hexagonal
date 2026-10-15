import { beforeEach, describe, expect, test } from "@jest/globals";
import { createFollowingFixture, FollowingFixture } from "./following.fixture";

describe("Feature: Following a user", () => {
  let fixture: FollowingFixture;

  beforeEach(() => {
    fixture = createFollowingFixture();
   
  });

  test("Alice can follow Bob", async () => {
    fixture.givenUserFollowers({
      user: "Alice",
      followees: ["Charlie"],
    });

    await fixture.whenUserFollows({
      user: "Alice",
      userToFollow: "Bob",
    });

    await fixture.thenUserFolloweesAre({
      user: "Alice",
      followees: ["Charlie", "Bob"],
    });
  });
});

