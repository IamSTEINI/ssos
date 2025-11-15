export default function calculate_astronaut_abbreviation(id: number) {
    const first = parseInt(id.toString()[0]);
    const sum = id
        .toString()
        .split("")
        .reduce((sum, digit) => sum + parseInt(digit), 0);
    return sum + (first % id);
}
