import { AbstractJob } from './abstract.job';
import { Job } from '../decorators/job.decorator';

@Job({ name: 'Fibonacci', description: 'Calculates the Fibonacci sequence' })
export class FibonacciJob extends AbstractJob {}
