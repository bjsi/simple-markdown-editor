import { Markdown } from './parseChain'

class HtmlHandler{

    private markdownChange: Markdown = new Markdown;
    public TextChangeHandler(input: string, output: string): void {
        
        let markdownInput = <HTMLTextAreaElement>document.getElementById(input);
        let htmlOutput = <HTMLLabelElement>document.getElementById(output);

        if (markdownInput) {
            markdownInput.onkeyup = (e) => {
                this.RenderHtmlContent(markdownInput, htmlOutput);
            }
            window.onload = (e) => {
                this.RenderHtmlContent(markdownInput, htmlOutput);
            }
        }
    }

    private RenderHtmlContent(markdownInput: HTMLTextAreaElement, htmlOutput: HTMLLabelElement) {
        if (markdownInput.value) {
            if (htmlOutput) {
                htmlOutput.innerHTML = (this
                                        .markdownChange
                                        .ToHtml(markdownInput.value)
                                        .replace(/\n/g,"<BR>"));
            }
        }
        else {
            htmlOutput.innerHTML = "<p></p>";
        }
    }
}

new HtmlHandler().TextChangeHandler("markdown-input", "html-output");