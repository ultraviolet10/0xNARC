export const ghUrlCheck = (url: string) => {
  const regex =
    /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9_.-]+\/?$/
  return regex.test(url)
}
