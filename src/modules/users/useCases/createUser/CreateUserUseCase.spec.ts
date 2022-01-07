import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to create a new user", async () => {
        const name = "John";
        const email = "john@example.com";
        const password = "password";

        const user = await createUserUseCase.execute({
            name,
            email,
            password
        });

        expect(user).toHaveProperty("id");
        expect(user.email).toBe("john@example.com");
    });

    it("should not be able to create a new user if the user already exists", async () => {
        const name = "John";
        const password = "password";

        await createUserUseCase.execute({
            name,
            email: "john@example.com",
            password
        });

        await expect(
            createUserUseCase.execute({
                name,
                email: "john@example.com",
                password
            }),
        ).rejects.toBeInstanceOf(CreateUserError);
    });
});