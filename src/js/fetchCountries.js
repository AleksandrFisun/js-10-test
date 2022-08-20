export default function search(country) {
  return fetch(
    `https://restcountries.com/v3.1/name/${country}?fields=name,capital,population,languages,flags`
  ).then(response => {
    return response.json();
  });
}
