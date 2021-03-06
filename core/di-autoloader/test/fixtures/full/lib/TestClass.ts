/**
 * A simple test class that requires config to be injected. Notice how this class has no fancy decorators or
 * frameworks, which allows it to be tested very cleanly and easily (ie. just pass in the mock config in your tests)!
 */
import { TestConfig2 } from '../config/config';
import TestFunction from './TestFunction';

class TestClass {
  private readonly data: string;

  constructor(private readonly config: TestConfig2, private readonly testFunction: typeof TestFunction) {
    this.data = `here's some data`;
  }

  public getBar(): string {
    return this.config.bar;
  }

  /**
   * @return {Function}
   */
  public getFunction(): typeof TestFunction {
    return this.testFunction;
  }

  /**
   * @return {string}
   */
  public getData(): string {
    return this.data;
  }
}

export default TestClass;
