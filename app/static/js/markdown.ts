import { Header1ChainHandler, ChainOfResponsibilityFactory } from './parser'

export interface IMarkdownDocument {
    Add(...content: string[]): void;
    Get(): string
}

/**
 * Represents the line getting parsed.
 */
export class ParseElement {
    CurrentLine: string = "";
}

/**
 * Represents a block of markdown text.
 */
class MarkdownDocument implements IMarkdownDocument {
    
    private content: string = "";

    /**
     * Add words to the markdown content. 
     * @param content The words to add to the markdown content.
     */
    Add(...content: string[]): void {
        content.forEach(str => {
            this.content += str;
        });
    }

    /**
     * Get the markdown content.
     * @returns markdown content.
     */
    Get(): string {
        return this.content;
    }
}

export class Markdown {
    public ToHtml(text: string): string {
        let document: IMarkdownDocument = new MarkdownDocument();
        let header1: Header1ChainHandler = new ChainOfResponsibilityFactory().Build(document);
        let lines: string[] = text.split('\n');
        lines.forEach(line => {
            let parseElement: ParseElement = new ParseElement();
            parseElement.CurrentLine = line;
            header1.HandleRequest(parseElement);
        });
        return document.Get();
    }
}