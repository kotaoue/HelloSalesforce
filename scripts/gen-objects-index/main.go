package main

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

func main() {
	objectsDir := filepath.Join("..", "..", "docs", "objects")
	if len(os.Args) > 1 {
		objectsDir = os.Args[1]
	}

	entries, err := os.ReadDir(objectsDir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading directory %s: %v\n", objectsDir, err)
		os.Exit(1)
	}

	var names []string
	for _, entry := range entries {
		if !entry.IsDir() && strings.EqualFold(filepath.Ext(entry.Name()), ".csv") {
			names = append(names, entry.Name())
		}
	}
	sort.Strings(names)

	fmt.Println("<ul>")
	for _, name := range names {
		label := strings.TrimSuffix(name, filepath.Ext(name))
		fmt.Printf("  <li><a href=\"%s\">%s</a></li>\n", name, label)
	}
	fmt.Println("</ul>")
}
