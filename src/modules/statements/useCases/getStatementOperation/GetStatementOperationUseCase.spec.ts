import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;


describe("Get Statement Operation", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    });

    it("should be able to get a statement operation", async () => {
        const user = await inMemoryUsersRepository.create({
            email: "john@example.com",
            name: "John",
            password: "password"
        });

        const statementCreated = await inMemoryStatementsRepository.create({
            amount: 100,
            description: "Deposit description",
            type: "deposit",
            user_id: user.id
        } as ICreateStatementDTO)

        const operation = await getStatementOperationUseCase.execute({
            statement_id: statementCreated.id as string,
            user_id: user.id as string
        });

        expect(operation.id).toBe(statementCreated.id);
        expect(operation.user_id).toBe(statementCreated.user_id);
        expect(operation.amount).toBe(100);
        expect(operation.type).toBe("deposit");
    });

    it("should not be able to get a statement operation if user id doesn't exist", async () => {
        const user = await inMemoryUsersRepository.create({
            email: "john@example.com",
            name: "John",
            password: "password"
        });

        const statementCreated = await inMemoryStatementsRepository.create({
            amount: 100,
            description: "Deposit description",
            type: "deposit",
            user_id: user.id
        } as ICreateStatementDTO)

        await expect(
            getStatementOperationUseCase.execute({
                statement_id: statementCreated.id as string,
                user_id: "Wrong user id"
            }),
        ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });

    it("should not be able to get a statement operation if statement id doesn't exist", async () => {
        const user = await inMemoryUsersRepository.create({
            email: "john@example.com",
            name: "John",
            password: "password"
        });

        const statementCreated = await inMemoryStatementsRepository.create({
            amount: 100,
            description: "Deposit description",
            type: "deposit",
            user_id: user.id
        } as ICreateStatementDTO)

        await expect(
            getStatementOperationUseCase.execute({
                statement_id: "Wrong statement id",
                user_id: user.id as string
            }),
        ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });
});