import { Injectable } from "@nestjs/common";
import { getTime } from "@utils/time";

@Injectable()
export class SampleService {
    getHello(): string {
        return `Hello World! at ${getTime()}`;
    }
}
