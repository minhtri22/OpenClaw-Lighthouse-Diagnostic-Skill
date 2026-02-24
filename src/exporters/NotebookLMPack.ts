import { ResearchPack } from "../domain/ReportTypes";
import { promises as fs } from "fs";
import path from "path";
import { MarkdownGenerator } from "./MarkdownGenerator";

export class NotebookLMPack {
  constructor(private readonly baseDir: string = "reports") {}

  async export(pack: ResearchPack): Promise<string> {
    const generator = new MarkdownGenerator();
    const content = generator.researchPack(pack);
    await fs.mkdir(this.baseDir, { recursive: true });
    const filePath = path.join(this.baseDir, `${this.slugify(pack.title)}.md`);
    await fs.writeFile(filePath, content, "utf-8");
    return filePath;
  }

  private slugify(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  }
}
