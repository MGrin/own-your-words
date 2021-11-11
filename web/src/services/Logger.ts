export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  public log(...messages: string[]) {
    console.log(
      `[${new Date().toLocaleString()}][${this.context}] ${messages.join(
        "\n\t"
      )}`
    );
  }

  public warn(...messages: string[]) {
    console.warn(
      `[${new Date().toLocaleString()}][${this.context}] ${messages.join(
        "\n\t"
      )}`
    );
  }

  public error(...messages: Error[]) {
    console.error(`[${new Date().toLocaleString()}][${this.context}]: Error`);
    for (let err of messages) {
      console.error(err);
    }
  }
}
