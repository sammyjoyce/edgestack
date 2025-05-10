export async function copyText(
	text: string,
	container: HTMLElement = document.body,
): Promise<boolean> {
	if (navigator.clipboard) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch (error) {}
	}
	const textArea = document.createElement("textarea");
	textArea.value = text;
	textArea.style.position = "fixed";
	textArea.style.top = "0";
	textArea.style.left = "0";
	textArea.style.opacity = "0";
	container.appendChild(textArea);
	textArea.focus();
	textArea.select();
	let succeeded = false;
	try {
		succeeded = document.execCommand("copy");
	} catch (error) {}
	container.removeChild(textArea);
	return succeeded;
}
