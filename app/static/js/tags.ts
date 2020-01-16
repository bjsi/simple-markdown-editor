/**
 * An enum of the supported HTML tag types.
 */
export enum TagType {
    Paragraph,
    Header1,
    Header2,
    Header3,
    Header4,
    Header5,
    Header6,
    Bold,
    Italics,
    HorizontalRule
}

/**
 * Creates a mapping between a tag's name and the HTML tag
 */
export class TagTypeToHtml{
    private readonly tagType: Map<TagType, string> = new Map<TagType, string>();
    constructor() {
        this.tagType.set(TagType.Header1, "h1");
        this.tagType.set(TagType.Header2, "h2");
        this.tagType.set(TagType.Header3, "h3");
        this.tagType.set(TagType.Header4, "h4");
        this.tagType.set(TagType.Header5, "h5");
        this.tagType.set(TagType.Header6, "h6");
        this.tagType.set(TagType.Bold, "b");
        this.tagType.set(TagType.Italics, "i");
        this.tagType.set(TagType.Paragraph, "p");
        this.tagType.set(TagType.HorizontalRule, "hr");
    }
    
    /**
     * Finds unbracketed tags in tag map. Returns bracketed tag or bracketed p tag.
     * @param tagType map of formatting names to html tags.
     * @param openingTagPattern < or </.
     * @returns Bracketed tag or a bracketed p tag.
     */
    private GetTag(tagType: TagType, openingTagPattern: string)  {
        let tag = this.tagType.get(tagType);
        if (tag) {
            return `${openingTagPattern}${tag}>`;
        }
        return `${openingTagPattern}p>`;
    }

    /**
     * Returns tag starting with <.
     * @param tagType HTML tag.
     */
    public OpeningTag(tagType: TagType): string {
        return this.GetTag(tagType, "<");
    }

    /**
     * Returns tag starting with </.
     * @param tagType HTML tag.
     */
    public ClosingTag(tagType: TagType): string {
        return this.GetTag(tagType, "</");
    }
}