import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    })

    it("should be able to authenticate an user", async () => {
        const email = "john@example.com"
        const password = "password";

        await createUserUseCase.execute({
            name: "John",
            email,
            password,
        });

        const authenticate = await authenticateUserUseCase.execute({
            email,
            password,
        });

        expect(authenticate).toHaveProperty("user");
        expect(authenticate.user).toHaveProperty("id");
        expect(authenticate).toHaveProperty("token");
    });

    it("should not be able to authenticate an user with a non-existing email", async () => {
        const email = "john@example.com"
        const password = "password";

        await createUserUseCase.execute({
            name: "John",
            email,
            password,
        });

        await expect(
            authenticateUserUseCase.execute({
                email: "Wrong email",
                password,
            }),
        ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("should not be able to authenticate an user with a wrong password", async () => {
        const email = "john@example.com"
        const password = "password";

        await createUserUseCase.execute({
            name: "John",
            email,
            password,
        });

        await expect(
            authenticateUserUseCase.execute({
                email,
                password: "Wrong password",
            }),
        ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
});