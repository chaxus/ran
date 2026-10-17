import { createObjectURL, requestUrlToBuffer } from '@/utils';
import type { RequestUrlToArraybufferOption, requestUrlToArraybufferReturn } from '@/utils/bom';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Assert<T extends true> = T;

// Compiled by the package's real tsc command; never executed as a runtime test.
export async function binaryHelperTypeContracts(
  dynamic: XMLHttpRequestResponseType,
  optionalBlob: { responseType?: 'blob' },
  options: Partial<RequestUrlToArraybufferOption>,
  binaryMode: 'blob' | 'arraybuffer',
): Promise<void> {
  const defaultResult = await requestUrlToBuffer('/asset');
  const emptyOptions = await requestUrlToBuffer('/asset', {});
  const defaultFields = await requestUrlToBuffer('/asset', { method: 'POST', responseType: undefined });
  const arraybuffer = await requestUrlToBuffer('/asset', { responseType: 'arraybuffer' });
  const emptyMode = await requestUrlToBuffer('/asset', { responseType: '' });
  const blob = await requestUrlToBuffer('/asset', { responseType: 'blob' });
  const text = await requestUrlToBuffer('/asset', { responseType: 'text' });
  const document = await requestUrlToBuffer('/asset', { responseType: 'document' });
  const json = await requestUrlToBuffer('/asset', { responseType: 'json' });
  const dynamicResult = await requestUrlToBuffer('/asset', { responseType: dynamic });
  const optionalResult = await requestUrlToBuffer('/asset', optionalBlob);
  const broadOptionsResult = await requestUrlToBuffer('/asset', options);
  const binaryResult = await requestUrlToBuffer('/asset', { responseType: binaryMode });
  const progressResult = requestUrlToBuffer('/asset', {
    onProgress(event) {
      const _event: Assert<Equal<typeof event, ProgressEvent>> = true;
      void _event;
    },
  });

  type Contracts = [
    Assert<Equal<typeof defaultResult.data, ArrayBuffer>>,
    Assert<Equal<typeof emptyOptions.data, ArrayBuffer>>,
    Assert<Equal<typeof defaultFields.data, ArrayBuffer>>,
    Assert<Equal<typeof arraybuffer.data, ArrayBuffer>>,
    Assert<Equal<typeof emptyMode.data, ArrayBuffer>>,
    Assert<Equal<typeof blob.data, Blob>>,
    Assert<Equal<typeof text.data, string>>,
    Assert<Equal<typeof document.data, Document | null>>,
    Assert<Equal<typeof json.data, unknown>>,
    Assert<Equal<typeof dynamicResult.data, unknown>>,
    Assert<Equal<typeof optionalResult.data, Blob | ArrayBuffer>>,
    Assert<Equal<typeof broadOptionsResult.data, unknown>>,
    Assert<Equal<typeof binaryResult.data, Blob | ArrayBuffer>>,
    Assert<Equal<Awaited<typeof progressResult>['data'], ArrayBuffer>>,
    Assert<Equal<requestUrlToArraybufferReturn['data'], ArrayBuffer>>,
    Assert<Equal<requestUrlToArraybufferReturn<Blob>['data'], Blob>>,
  ];
  const assertions: Contracts = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
  void assertions;

  // @ts-expect-error default data is bytes rather than a Blob
  const wrongDefault: Blob = defaultResult.data;
  // @ts-expect-error JSON must be narrowed or validated before accessing its properties
  void json.data.unchecked;
  // @ts-expect-error arbitrary response strings are not XMLHttpRequest response modes
  requestUrlToBuffer('/asset', { responseType: 'bytes' });
  // @ts-expect-error progress callbacks receive a ProgressEvent, not arbitrary arguments
  requestUrlToBuffer('/asset', { onProgress: (_event: string) => undefined });
  void wrongDefault;

  const stringUrl: Promise<string> = createObjectURL('https://example.com/asset');
  const blobUrl: Promise<string> = createObjectURL(new Blob());
  const bufferUrl: Promise<string> = createObjectURL(new ArrayBuffer(0));
  const responseUrl: Promise<string> = createObjectURL(new Response());
  // @ts-expect-error only supported binary values and URLs are accepted
  createObjectURL(123);
  void [stringUrl, blobUrl, bufferUrl, responseUrl];
}
