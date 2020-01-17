export interface IMarkdownDocument {
    Add(...content: string[]): void;
    Get(): string;
}

/**
 * CHECK THIS: Represents the current markdown input document.
 */
export class MarkdownDocument implements IMarkdownDocument {
    private content: string = "";
    Add(...content: string[]): void {
        content.forEach(item => {
            this.content += item;
        });
    }
    Get(): string {
        return this.content;
    }
}
