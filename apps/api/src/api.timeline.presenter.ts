import { TimelinePresenter } from '@app/crafty/application/timeline.presenter';
import { Timeline } from '@app/crafty/domain/timeline';
import { FastifyReply } from 'fastify';

export class ApiTimelinePresenter implements TimelinePresenter {
  constructor(private readonly response: FastifyReply) {}
  show(timeline: Timeline) {
    this.response.status(200).send(timeline.data);
  }
}