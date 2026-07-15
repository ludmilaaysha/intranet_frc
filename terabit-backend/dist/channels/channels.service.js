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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const child_process_1 = require("child_process");
const path_1 = require("path");
const channel_entity_1 = require("./entities/channel.entity");
const channel_constants_1 = require("./channel.constants");
let ChannelsService = class ChannelsService {
    channelsRepository;
    constructor(channelsRepository) {
        this.channelsRepository = channelsRepository;
    }
    transmissions = new Map();
    findAll() {
        return this.channelsRepository.find();
    }
    findFeatured() {
        return this.channelsRepository.find({
            take: 5,
            order: {
                viewers: 'DESC',
            },
        });
    }
    async findOne(id) {
        const channel = await this.channelsRepository.findOne({
            where: { id },
        });
        if (!channel) {
            throw new common_1.NotFoundException(`Canal ${id} não encontrado`);
        }
        return channel;
    }
    async create(dto) {
        const multicastGroup = await this.generateMulticastGroup();
        const channel = this.channelsRepository.create({
            ...dto,
            multicastGroup,
            port: channel_constants_1.DEFAULT_MULTICAST_PORT,
        });
        return this.channelsRepository.save(channel);
    }
    async update(id, dto) {
        const channel = await this.findOne(id);
        Object.assign(channel, dto);
        return this.channelsRepository.save(channel);
    }
    async remove(id) {
        const processVlc = this.transmissions.get(id);
        if (processVlc) {
            processVlc.kill();
            this.transmissions.delete(id);
        }
        const result = await this.channelsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Canal ${id} não encontrado`);
        }
    }
    async generateMulticastGroup() {
        const channels = await this.channelsRepository.find();
        const used = new Set(channels.map((channel) => channel.multicastGroup));
        for (let i = 1; i <= 254; i++) {
            const address = `239.10.10.${i}`;
            if (!used.has(address)) {
                return address;
            }
        }
        throw new Error('Não há grupos multicast disponíveis.');
    }
    async startTransmission(id) {
        const channel = await this.findOne(id);
        if (this.transmissions.has(id)) {
            return {
                message: 'Canal já está transmitindo.',
            };
        }
        if (!channel.videoUrl) {
            throw new common_1.BadRequestException('Canal não possui vídeo.');
        }
        const videoPath = (0, path_1.join)(process.cwd(), channel.videoUrl.replace(/^\/+/, ''));
        const vlcPath = process.platform === 'win32'
            ? 'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe'
            : 'cvlc';
        const processVlc = (0, child_process_1.spawn)(vlcPath, [
            videoPath,
            '--loop',
            '--sout',
            `#rtp{mux=ts,dst=${channel.multicastGroup},port=${channel.port}}`,
        ]);
        processVlc.stdout?.on('data', (data) => {
            console.log(data.toString());
        });
        processVlc.stderr?.on('data', (data) => {
            console.log(data.toString());
        });
        processVlc.on('error', (err) => {
            console.error(`Falha ao iniciar VLC para canal ${id}:`, err.message);
            this.transmissions.delete(id);
        });
        this.transmissions.set(id, processVlc);
        channel.status = channel_entity_1.ChannelStatus.ONLINE;
        channel.vlcPid = processVlc.pid ?? null;
        await this.channelsRepository.save(channel);
        return {
            message: 'Transmissão iniciada.',
        };
    }
    async stopTransmission(id) {
        const processVlc = this.transmissions.get(id);
        if (!processVlc) {
            return {
                message: 'Canal não está transmitindo.',
            };
        }
        processVlc.kill();
        this.transmissions.delete(id);
        const channel = await this.findOne(id);
        channel.status = channel_entity_1.ChannelStatus.OFFLINE;
        channel.vlcPid = null;
        await this.channelsRepository.save(channel);
        return {
            message: 'Transmissão encerrada.',
        };
    }
    async onModuleInit() {
        await this.channelsRepository
            .createQueryBuilder()
            .update(channel_entity_1.Channel)
            .set({
            status: channel_entity_1.ChannelStatus.OFFLINE,
            vlcPid: null,
        })
            .execute();
    }
    async playlist(id) {
        const channel = await this.findOne(id);
        channel.viewers++;
        await this.channelsRepository.save(channel);
        return `#EXTM3U
  #EXTINF:-1,${channel.name}
  udp://@${channel.multicastGroup}:${channel.port}
  `;
    }
};
exports.ChannelsService = ChannelsService;
exports.ChannelsService = ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChannelsService);
//# sourceMappingURL=channels.service.js.map