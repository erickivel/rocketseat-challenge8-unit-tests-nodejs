import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    });

    it("should be able to show user profile", async () => {
        const userCreated = await inMemoryUsersRepository.create({
            email: "john@example.com",
            name: "John",
            password: "password"
        });

        const userProfile = await showUserProfileUseCase.execute(userCreated.id as string)

        expect(userProfile).toHaveProperty("id");
        expect(userProfile.id).toBe(userCreated.id);
    });

    it("should not be able to show user profile if user_id doesn't exist", async () => {
        await inMemoryUsersRepository.create({
            email: "john@example.com",
            name: "John",
            password: "password"
        });

        await expect(
            showUserProfileUseCase.execute("Wrong user id"),
        ).rejects.toBeInstanceOf(ShowUserProfileError);
    });
});