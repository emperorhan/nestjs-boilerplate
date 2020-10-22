import { Test, TestingModule } from "@nestjs/testing";
import { SampleController } from "./sample.controller";

describe("SampleController", () => {
    let controller: SampleController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [SampleController]
        }).compile();

        controller = app.get<SampleController>(SampleController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
