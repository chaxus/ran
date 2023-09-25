import { describe, expect, it } from 'vitest';
import select from '@/sort/select';
import insert from '@/sort/insert';
import shell from '@/sort/shell';
import merge from '@/sort/merge';
import quick from '@/sort/quick';
import randomArray from '@/sort/randomArray';
import taskEnd from '@/utils/taskEnd';
import startTask from '@/utils/startTask';
import bubble from '@/sort/bubble';
import heap from '@/sort/heap';
import count from '@/sort/count';
import bucket from '@/sort/bucket';
import radix from '@/sort/radix';

const handing = (name: string, sort: Function, limit: number = 10) => {
  it(name, () => {
    const taskId = startTask();
    for (let i = 0; i < limit; i++) {
      const exampleArray = randomArray();
      try {
        const result = sort(exampleArray);
        const rightResult = [...exampleArray].sort(
          (a: number, b: number) => a - b,
        );
        expect(result).toEqual(rightResult);
      } catch (error) {
        console.log(error, sort, exampleArray);
      }
    }
    const time = taskEnd(taskId);
    console.log(name, time);
  });
};

describe('sort', () => {
  handing('bubble sort', bubble);
  handing('select sort', select);
  handing('insert sort', insert);
  handing('shell sort', shell);
  handing('merge sort', merge);
  handing('quick sort', quick);
  handing('heap sort', heap);
  handing('count sort', count);
  handing('bucket sort', bucket);
  handing('radix sort', radix);
});
