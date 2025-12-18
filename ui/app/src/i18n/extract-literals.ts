// Copyright 2025 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { glob } from 'glob';

const SRC_DIR = path.resolve('app/src');
const OUTPUT_FILE = path.resolve('app/src/locales/en.dashboard.draft.json');

const literals: Record<string, string> = {};

function normalizeKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function extractFromFile(filePath: string): void {
  const sourceText = fs.readFileSync(filePath, 'utf8');

  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  function visit(node: ts.Node): void {
    if (ts.isJsxElement(node)) {
      if (node.children.length === 1) {
        const child = node.children[0];

        if (child && ts.isJsxText(child)) {
          const raw = child.getText(sourceFile).trim();

          if (raw) {
            const key = normalizeKey(raw);

            if (!literals[key]) {
              literals[key] = raw;
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

async function main(): Promise<void> {
  const files = await glob('**/*.tsx', {
    cwd: SRC_DIR,
    absolute: true,
  });

  files.forEach(extractFromFile);

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(literals, null, 2), 'utf8');

  console.log(`Extracted ${Object.keys(literals).length} literals`);
}

main().catch(console.error);
