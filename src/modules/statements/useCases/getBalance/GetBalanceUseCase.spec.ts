import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    });

    it("should be able to get balance", async () => {
        const user = await inMemoryUsersRepository.create({
            email: "john@example.com",
            name: "John",
            password: "password"
        });

        await inMemoryStatementsRepository.create({
            amount: 100,
            description: "Deposit statement",
            type: "deposit",
            user_id: user.id
        } as ICreateStatementDTO);

        const balance = await getBalanceUseCase.execute({ user_id: user.id as string });

        expect(balance).toHaveProperty("balance");
        expect(balance.balance).toBe(100);
        expect(balance).toHaveProperty("statement");
        expect(balance.statement.length).toBe(1);
    });

    it("should be able to get balance if user_id doesn't exist", async () => {
        await inMemoryUsersRepository.create({
            email: "john@example.com",
            name: "John",
            password: "password"
        });

        await expect(
            getBalanceUseCase.execute({ user_id: "Wrong user id" }),
        ).rejects.toBeInstanceOf(GetBalanceError);

    });
});