export declare enum ChannelCategory {
    NOTICIAS = "Not\u00EDcias",
    ESPORTES = "Esportes",
    FILMES = "Filmes",
    SERIES = "S\u00E9ries",
    DOCUMENTARIO = "Document\u00E1rio",
    INFANTIL = "Infantil",
    MUSICA = "M\u00FAsica",
    VARIEDADES = "Variedades"
}
export declare enum ChannelStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE"
}
export declare class Channel {
    id: number;
    name: string;
    description: string;
    category: ChannelCategory;
    thumbnailUrl: string | null;
    videoUrl: string | null;
    multicastGroup: string;
    port: number;
    isActive: boolean;
    autoStart: boolean;
    lastBroadcast: Date | null;
    viewers: number;
    status: ChannelStatus;
    featured: boolean;
    bannerUrl: string | null;
    subtitle: string | null;
    vlcPid: number | null;
    createdAt: Date;
}
