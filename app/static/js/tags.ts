/**
 * Names of supported formatting tags.
 */
export enum TagName {
    Paragraph,
    Header1,
    Header2,
    Header3,
    Header4,
    Header5,
    Header6,
    Bold,
    Italic,
    HorizontalRule
}

/**
 * Maps tag names to HTML tags.
 */
export class TagNameToHtml {
    private readonly htmlTags: Map<TagName, string> = new Map<TagName, string>();
    constructor() {
        this.htmlTags.set(TagName.Header1, "h1");
        this.htmlTags.set(TagName.Header2, "h2");
        this.htmlTags.set(TagName.Header3, "h3");
        this.htmlTags.set(TagName.Header4, "h4");
        this.htmlTags.set(TagName.Header5, "h5");
        this.htmlTags.set(TagName.Header6, "h6");
        this.htmlTags.set(TagName.Paragraph, "p");
        this.htmlTags.set(TagName.Bold, "b");
        this.htmlTags.set(TagName.Italic, "i");
        this.htmlTags.set(TagName.HorizontalRule, "hr");
    }

    /**
     * Get HTML tag according to the formatting name and the opening bracket pattern. 
     * @param tagName Name of a supported formatting tag.
     * @param openingPattern Either "<" for an opening bracket or "</" for a closing bracket
     */
    private GetTag(tagName: TagName, openingPattern: string): string {
        let tag = this.htmlTags.get(tagName);
        if (tag) {
            return `${openingPattern}${tag}>`;
        }
        else {
            return `${openingPattern}p>`;
        }
    }

    /**
     * Get an opening HTML tag according to the formatting name.
     * @param tagName Name of a supported formatting tag.
     */
    public getOpeningTag(tagName: TagName): string {
        return this.GetTag(tagName, "<");
    }

    /**
     * Get a closing HTML tag according to the formatting name.
     * @param tagName Name of a supported formatting tag.
     */
    public getClosingTag(tagName: TagName): string {
        return this.GetTag(tagName, "</");
    }
}