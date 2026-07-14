"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = exports.ChannelStatus = exports.ChannelCategory = void 0;
const typeorm_1 = require("typeorm");
var ChannelCategory;
(function (ChannelCategory) {
    ChannelCategory["NOTICIAS"] = "Not\u00EDcias";
    ChannelCategory["ESPORTES"] = "Esportes";
    ChannelCategory["FILMES"] = "Filmes";
    ChannelCategory["SERIES"] = "S\u00E9ries";
    ChannelCategory["DOCUMENTARIO"] = "Document\u00E1rio";
    ChannelCategory["INFANTIL"] = "Infantil";
    ChannelCategory["MUSICA"] = "M\u00FAsica";
    ChannelCategory["VARIEDADES"] = "Variedades";
})(ChannelCategory || (exports.ChannelCategory = ChannelCategory = {}));
var ChannelStatus;
(function (ChannelStatus) {
    ChannelStatus["ONLINE"] = "ONLINE";
    ChannelStatus["OFFLINE"] = "OFFLINE";
})(ChannelStatus || (exports.ChannelStatus = ChannelStatus = {}));
let Channel = class Channel {
    id;
    name;
    description;
    category;
    thumbnailUrl;
    videoUrl;
    multicastGroup;
    port;
    isActive;
    autoStart;
    lastBroadcast;
    viewers;
    status;
    featured;
    bannerUrl;
    subtitle;
    vlcPid;
    createdAt;
};
exports.Channel = Channel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Channel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Channel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Channel.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ChannelCategory,
    }),
    __metadata("design:type", String)
], Channel.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Channel.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Channel.prototype, "videoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Channel.prototype, "multicastGroup", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Channel.prototype, "port", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: true,
    }),
    __metadata("design:type", Boolean)
], Channel.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], Channel.prototype, "autoStart", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Channel.prototype, "lastBroadcast", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0,
    }),
    __metadata("design:type", Number)
], Channel.prototype, "viewers", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ChannelStatus,
        default: ChannelStatus.OFFLINE,
    }),
    __metadata("design:type", String)
], Channel.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], Channel.prototype, "featured", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Channel.prototype, "bannerUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Channel.prototype, "subtitle", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Channel.prototype, "vlcPid", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Channel.prototype, "createdAt", void 0);
exports.Channel = Channel = __decorate([
    (0, typeorm_1.Entity)('channels')
], Channel);
//# sourceMappingURL=channel.entity.js.map