import { Test, TestingModule } from "@nestjs/testing";
import { SampleController } from "./sample.controller";
import { SampleService } from "./sample.service";

describe("SampleController", () => {
    let controller: SampleController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [SampleService],
            controllers: [SampleController]
        }).compile();

        controller = app.get<SampleController>(SampleController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
