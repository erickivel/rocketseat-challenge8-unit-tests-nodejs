import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    });

    it("should be able to create a new statement", async () => {
        const user = await inMemoryUsersRepository.create({
            email: "john@example.com",
            name: "John",
            password: "password"
        });

        const statement = await createStatementUseCase.execute({
            amount: 100,
            description: "Description deposit",
            type: "deposit",
            user_id: user.id
        } as ICreateStatementDTO);

        expect(statement).toHaveProperty("id");
        expect(statement.user_id).toBe(user.id);
        expect(statement.type).toBe("deposit");
        expect(statement.amount).toBe(100);
    });

    it("should be able to create a new statement if user_id doesn't exist", async () => {
        const user = await inMemoryUsersRepository.create({
            email: "john@example.com",
            name: "John",
            password: "password"
        });

        await expect(
            createStatementUseCase.execute({
                amount: 100,
                description: "Description deposit",
                type: "deposit",
                user_id: "Wrong user id"
            } as ICreateStatementDTO),
        ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });

    it("should be able to create a new statement if withdraw value is greater than balance", async () => {
        const user = await inMemoryUsersRepository.create({
            email: "john@example.com",
            name: "John",
            password: "password"
        });

        await createStatementUseCase.execute({
            amount: 1,
            description: "Description deposit",
            type: "deposit",
            user_id: user.id
        } as ICreateStatementDTO);

        await expect(
            createStatementUseCase.execute({
                amount: 200,
                description: "Description withdraw",
                type: "withdraw",
                user_id: user.id
            } as ICreateStatementDTO),
        ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
});