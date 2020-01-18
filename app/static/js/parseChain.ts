import { ParseElement, BoldVisitor, ItalicVisitor } from './addHtmlTags'
import { IMarkdownDocument,
         MarkdownDocument } from './markdown'
import { IVisitor,
         Header1Visitor,
         Header2Visitor,
         Header3Visitor,
         Header4Visitor,
         Header5Visitor,
         Header6Visitor,
         ParagraphVisitor,
         HorizontalRuleVisitor } from './addHtmlTags'

/**
 * All Visitors come to the same visitable 
 */
interface IVisitable {
    Accept(visitor: IVisitor, token: ParseElement, markdownDocument: IMarkdownDocument): void;
}

class Visitable implements IVisitable {
    Accept(visitor: IVisitor, token: ParseElement, markdownDocument: IMarkdownDocument): void {
        visitor.Visit(token, markdownDocument);
    }
}

abstract class Handler<T> {
    protected next: Handler<T> | null = null;
    public SetNext(next: Handler<T>): void {
        this.next = next;
    }
    public HandleRequest(request: T): void {
        if(!this.CanHandle(request)) {
            if (this.next) {
                this.next.HandleRequest(request);
            }
            return;
        }
    }
    protected abstract CanHandle(request: T): boolean;
}

class ParseChainHandler extends Handler<ParseElement> {
    private readonly visitable: IVisitable = new Visitable();
    constructor(private readonly document: IMarkdownDocument,
                private readonly tagName: string,
                private readonly markdownDoubleTag: boolean,
                private readonly visitor: IVisitor){
                    super();
                }
    protected CanHandle(request: ParseElement): boolean {
        let split = new LineParser().Parse(request.CurrentLine, this.tagName, this.markdownDoubleTag);
        if (split[0]) {
            request.CurrentLine = split[1];
            this.visitable.Accept(this.visitor, request, this.document);
        }
        return split[0];
    }
}

class LineParser {
    public Parse(value: string, tag: string, markdownDoubleTag: boolean): [boolean, string] {
        let output: [boolean, string] = [false, ""];
        output[1] = value;
        if (value === "") {
            return output;
        }
        if (!markdownDoubleTag) {
            let split = value.startsWith(`${tag}`);
            if (split) {
                output[0] = true;
                output[1] = value.substr(tag.length);
            }
        }
        else {
            let start = value.startsWith(`${tag}`);
            let end = value.endsWith(`${tag}`);
            if (start && end) {
                output[0] = true;
                output[1] = value.slice(tag.length, value.length - tag.length);
            }
        }
        return output;
    }
}


class ParagraphHandler extends Handler <ParseElement> {
    private readonly visitable: IVisitable = new Visitable();
    private readonly visitor: IVisitor = new ParagraphVisitor();
    constructor(private readonly document: IMarkdownDocument) {
        super();
    }
    protected CanHandle(request: ParseElement): boolean {
        this.visitable.Accept(this.visitor, request, this.document);
        return true;
    }
}

class BoldHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "**", true, new BoldVisitor());
    }
}


class ItalicHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "*", true, new ItalicVisitor());
    }
}

class Header1ChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "#", false, new Header1Visitor());
    }
}

class Header2ChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "##", false, new Header2Visitor());
    }
}
class Header3ChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "###", false, new Header3Visitor());
    }
}
class Header4ChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "####", false, new Header4Visitor());
    }
}

class Header5ChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "#####", false,  new Header5Visitor());
    }
}

class Header6ChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "######", false, new Header6Visitor());
    }
}

class HorizontalHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "---", false, new HorizontalRuleVisitor())
    }
}

class ChainOfResponsibilityFactory {
    Build(document: IMarkdownDocument): ParseChainHandler {
        let header1: Header1ChainHandler = new Header1ChainHandler(document);
        let header2: Header2ChainHandler = new Header2ChainHandler(document);
        let header3: Header3ChainHandler = new Header3ChainHandler(document);
        let header4: Header4ChainHandler = new Header4ChainHandler(document);
        let header5: Header5ChainHandler = new Header5ChainHandler(document);
        let header6: Header6ChainHandler = new Header6ChainHandler(document);
        let horizontalRule: HorizontalHandler = new HorizontalHandler(document);
        let paragraph: ParagraphHandler = new ParagraphHandler(document);
        let bold: BoldHandler = new BoldHandler(document);
        let italic: ItalicHandler = new ItalicHandler(document);

        header6.SetNext(header5);
        header5.SetNext(header4);
        header4.SetNext(header3);
        header3.SetNext(header2);
        header2.SetNext(header1);
        header1.SetNext(horizontalRule);
        horizontalRule.SetNext(bold);
        bold.SetNext(italic);
        italic.SetNext(paragraph);

        return header6;
    }
}

export class Markdown {
    public ToHtml(text: string): string {
        let document: IMarkdownDocument = new MarkdownDocument();
        let header1: Header1ChainHandler = new ChainOfResponsibilityFactory().Build(document);
        let lines: string[] = text.split(`\n`);
        lines.forEach(line => {
            let parseElement: ParseElement = new ParseElement();
            parseElement.CurrentLine = line;
            header1.HandleRequest(parseElement);
        });
        return document.Get();
    }
}