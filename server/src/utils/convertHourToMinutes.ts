export function convertHourToMinutes(time: string) {
    /* separando o que vem antes dos ":" e o que vem depois
    e armazenando nas variáveis desestruturadas */
    const [hour, minutes] = time.split(':').map(Number)
    const timeInMinutes = hour * 60 + minutes

    return timeInMinutes
}