import { Markdown } from './markdown';


/**
 * 
 */
export class HtmlHandler {
    private markdownChange: Markdown = new Markdown();
    public TextChangeHandler(id: string, output: string): void {
        let markdown = <HTMLTextAreaElement>document.getElementById(id);
        let markdownOutput = <HTMLLabelElement>document.getElementById(output);
        if (markdown != null) {
            markdown.onkeyup = (e) => {
                if (markdown.value) {
                    this.RenderHtmlContent(markdown, markdownOutput);
                }
                window.onload = (e) => {
                    this.RenderHtmlContent(markdown, markdownOutput);
                }
            }
        }
    }
    private RenderHtmlContent(markdown: HTMLTextAreaElement, markdownOutput: HTMLLabelElement) {
        if (markdown.value) {
            markdownOutput.innerHTML = this.markdownChange.ToHtml(markdown.value);
        }
        else {
            markdownOutput.innerHTML = "<p></p>";
        }
    }
}