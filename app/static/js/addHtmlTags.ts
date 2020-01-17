import { TagName } from './tags'
import { TagNameToHtml } from './tags'
import { IMarkdownDocument } from './markdown'

/**
 * The line currently being processed.
 */
export class ParseElement {
    CurrentLine: string = "";
}

/**
 * NOTE: When visit is called, relevant opening HTML tag is added, then the closing tag, to the markdownDocument.
 */
export interface IVisitor {
    Visit(token: ParseElement, markdownDocument: IMarkdownDocument): void;
}

abstract class VisitorBase implements IVisitor {
    constructor (private readonly tagName: TagName, private readonly tagNameToHtml: TagNameToHtml) {}
    Visit(token: ParseElement, markdownDocument: IMarkdownDocument): void {
        markdownDocument.Add(this
                             .tagNameToHtml
                             .getOpeningTag(this.tagName),
                             token.CurrentLine,
                             this.tagNameToHtml.getClosingTag(this.tagName))
    }
}

export class Header1Visitor extends VisitorBase {
    constructor() {
        super(TagName.Header1, new TagNameToHtml());
    }
}

export class Header2Visitor extends VisitorBase {
    constructor() {
        super(TagName.Header2, new TagNameToHtml());
    }
}

export class Header3Visitor extends VisitorBase {
    constructor() {
        super(TagName.Header3, new TagNameToHtml());
    }
}

export class Header4Visitor extends VisitorBase {
    constructor() {
        super(TagName.Header4, new TagNameToHtml());
    }
}

export class Header5Visitor extends VisitorBase {
    constructor() {
        super(TagName.Header5, new TagNameToHtml());
    }
}

export class Header6Visitor extends VisitorBase {
    constructor() {
        super(TagName.Header6, new TagNameToHtml());
    }
}

export class ParagraphVisitor extends VisitorBase {
    constructor() {
        super(TagName.Paragraph, new TagNameToHtml());
    }
}

export class BoldVisitor extends VisitorBase {
    constructor() {
        super(TagName.Bold, new TagNameToHtml());
    }
}

export class ItalicVisitor extends VisitorBase {
    constructor() {
        super(TagName.Italic, new TagNameToHtml());
    }
}

export class HorizontalRuleVisitor extends VisitorBase {
    constructor() {
        super(TagName.HorizontalRule, new TagNameToHtml());
    }
}