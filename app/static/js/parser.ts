// Tags
import { TagType, TagTypeToHtml } from './tags'
// Markdown
import { IMarkdownDocument, ParseElement } from './markdown'
// HTML
import { HtmlHandler } from './html';

interface IVisitor {
    Visit(token: ParseElement, markdownDocument: IMarkdownDocument): void;
}

interface IVisitable {
    Accept(visitor: IVisitor, token: ParseElement, markdownDocument: IMarkdownDocument): void;
}

abstract class VisitorBase implements IVisitor {
    constructor (private readonly tagType: TagType, private readonly TagTypeToHtml: TagTypeToHtml) {}

    Visit(token: ParseElement, markdownDocument: IMarkdownDocument): void {
        markdownDocument.Add(this.TagTypeToHtml.OpeningTag(this.tagType), token.CurrentLine, this.TagTypeToHtml.ClosingTag(this.tagType));
    }
}

class Header1Visitor extends VisitorBase {
    constructor() {
        super(TagType.Header1, new TagTypeToHtml());
    }
}

class Header2Visitor extends VisitorBase {
    constructor() {
        super(TagType.Header2, new TagTypeToHtml());
    }
}

class Header3Visitor extends VisitorBase {
    constructor() {
        super(TagType.Header3, new TagTypeToHtml());
    }
}

class Header4Visitor extends VisitorBase {
    constructor() {
        super(TagType.Header4, new TagTypeToHtml());
    }
}

class Header5Visitor extends VisitorBase {
    constructor() {
        super(TagType.Header5, new TagTypeToHtml());
    }
}

class Header6Visitor extends VisitorBase {
    constructor() {
        super(TagType.Header6, new TagTypeToHtml());
    }
}

class BoldVisitor extends VisitorBase {
    constructor() {
        super(TagType.Bold, new TagTypeToHtml());
    }
}

class ItalicsVisitor extends VisitorBase {
    constructor() {
        super(TagType.Italics, new TagTypeToHtml());
    }
}

class HorizontalRuleVisitor extends VisitorBase {
    constructor() {
        super(TagType.HorizontalRule, new TagTypeToHtml());
    }
}

class ParagraphVisitor extends VisitorBase {
    constructor() {
        super(TagType.Paragraph, new TagTypeToHtml());
    }
}

class Visitable implements IVisitable {
    Accept(visitor: IVisitor, token: ParseElement, markdownDocument: IMarkdownDocument): void{
        visitor.Visit(token, markdownDocument);
    }
}

abstract class Handler<T> {
    protected next: Handler<T> | null = null;
    public SetNext(next: Handler<T>): void {
        this.next;
    }
    public HandleRequest(request: T): void {
        if (!this.CanHandle(request)) {
            if (this.next !== null) {
                this.next.HandleRequest(request);
            }
            return;
        }
    }
    protected abstract CanHandle(request: T): boolean;
}

class ParseChainHandler extends Handler<ParseElement> {
    
    private readonly visitable: IVisitable = new Visitable();
    
    constructor(private readonly document: IMarkdownDocument, private readonly tagType: string, private readonly visitor: IVisitor) {
        super();
    }

    protected CanHandle(request: ParseElement): boolean {
        let split = new LineParser().Parse(request.CurrentLine, this.tagType);
        if (split[0]){
            request.CurrentLine = split[1];
            this.visitable.Accept(this.visitor, request, this.document);
        }
        return split[0];
    }

}

class ParagraphHandler extends Handler <ParseElement> {
    private readonly visitable: IVisitable = new Visitable();
    private readonly visitor: IVisitor = new ParagraphVisitor();
    
    constructor(private readonly document: IMarkdownDocument){
        super();
    }
    
    protected CanHandle(request: ParseElement): boolean {
        this.visitable.Accept(this.visitor, request, this.document);
        return true;
    }

}

export class Header1ChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "# ", new Header1Visitor());
    }
}

class Header2ChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "## ", new Header2Visitor());
    }
}

class Header3ChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "### ", new Header3Visitor());
    }
}

class Header4ChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "#### ", new Header4Visitor());
    }
}

class Header5ChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "##### ", new Header5Visitor());
    }
}

class Header6ChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "###### ", new Header6Visitor());
    }
}

class BoldChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "* ", new BoldVisitor());
    }
}

class ItalicChainHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "** ", new ItalicsVisitor());
    }
}

class HorizontalRuleHandler extends ParseChainHandler {
    constructor(document: IMarkdownDocument) {
        super(document, "---", new HorizontalRuleVisitor());
    }
}

export class ChainOfResponsibilityFactory {
    Build(document: IMarkdownDocument): ParseChainHandler {
        let header1: Header1ChainHandler = new Header1ChainHandler(document);
        let header2: Header2ChainHandler = new Header2ChainHandler(document);
        let header3: Header3ChainHandler = new Header3ChainHandler(document);
        let horizontalRule: HorizontalRuleHandler = new HorizontalRuleHandler(document);
        let paragraph: ParagraphHandler = new ParagraphHandler(document);

        header1.SetNext(header2);
        header2.SetNext(header3);
        header3.SetNext(horizontalRule);
        horizontalRule.SetNext(paragraph);

        return header1;
    }
}

class LineParser {
    public Parse(value: string, tag: string): [boolean, string] {
        let output: [boolean, string] = [false, ""];
        output[1] = value;
        if (value === "") {
            return output;
        }
        let split = value.startsWith(`${tag}`);
        if (split) {
            output[0] = true;
            output[1] = value.substr(tag.length);
        }
        return output;
    }
}


var handler = new HtmlHandler().TextChangeHandler("markdown", "markdown-output");