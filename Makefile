default: docker

css:
	npx tailwindcss -i ./tailwind.input.css -o ./docs/tailwind.output.css
