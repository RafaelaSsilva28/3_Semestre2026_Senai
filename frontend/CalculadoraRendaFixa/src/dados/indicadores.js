const indicadores = {
    poupanca: {
        titulo: "Poupança",
        descricao: "Rentabilidade mensal da poupança",
        unidade: "% a.m.",
        valor: 0.50,   // Aproximadamente 0.5% ao mês + TR (quando Selic > 8.5%)
    },
    selic: {
        titulo: "SELIC",
        descricao: "Taxa SELIC anualizada",
        unidade: "% a.a.",
        valor: 14.75,  // fallback
    },
    cdi: {
        titulo: "CDI",
        descricao: "Taxa CDI anualizada",
        unidade: "% a.a.",
        valor: 14.65,  // fallback
    },
}

export default indicadores;

