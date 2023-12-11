# r-player

Video player

Based on 'hlsjs' and' web components', let the native tag 'r-player' have a unified video control.
Do not use the 'new Player(options)' way to mount to the specified 'dom', view return view, logic return logic, see and get, more intuitive.

1. Drag and drop the progress bar
2. Volume control
3. The bitrate is automatically switched based on the current bandwidth
4. Manual definition switch
5. Play at double speed
6. Style custom overlay
7. 'hls' protocol standard encryption video playback
8. Based on native development, it can run in all frameworks and unify the cross-framework situation
9. Unified browser controls

## Code demo

<r-player style="display: block;width:100%;max-width:600px;height:300px;" src="/ran/hls/example.m3u8"></r-player>

```xml
  <r-player src="/ran/hls/example.m3u8"></r-player>
```

## Attribute

### src

Resource address of the video

### volume

Set the initial volume. The default is 0.5

### currentTime

Set the initial playback time. By default, the playback starts from the beginning

### playbackRate

Set the double speed. The default is 1.0

## `event`

### onchange

Listen for any player changes, and the value returned is as follows.

An 'instance of the player' can be obtained through this method.

Live by 'type' to judge different event types, perform different operations

| property    | explains that                           | is of type |
| ----------- | --------------------------------------- | ---------- |
| type        | Indicates the type of the changed event | 'string'   |
| data        | The value of the                        | 'Object'   |
| currentTime | The current playback time               | 'number'   |
| duration    | Total duration of videos                | 'number'   |
| tag         | An example of the player                | 'Element'  |

Where 'type' type has

| Name           | Description                                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| canplay        | Your browser is ready to play the media file, but it probably doesn't have enough data to play it to the end without pausing to buffer the content further.  |
| canplaythrough | The browser estimates that it canplay media until the end without stopping content buffering.                                                                |
| complete       | OfflineAudioContext The rendering is complete.                                                                                                               |
| durationchange | duration is triggered when the value of the                                                                                                                  | duration property changes.         |
| emptied        | Media content emptied; For example, when the media is already loaded (or partially loaded), this event is sent and the load() method is called to reload it. |
| ended          | The video stops playing because the media has reached the end point.                                                                                         |
| loadedmetadata | The metadata is loaded.                                                                                                                                      |
| progress       | is triggered periodically when the browser loads the resource.                                                                                               |
| ratechange     | The play rate changes.                                                                                                                                       |
| seeked         | The seek operation is complete.                                                                                                                              |
| seeking        | seek begins.                                                                                                                                                 |
| stalled        | The user agent is trying to obtain media data but it has not appeared unexpectedly.                                                                          |
| suspend        | Media data loading has been suspended.                                                                                                                       |
| loadeddata     | The first frame in media has been added                                                                                                                      | media has loaded.                  |
| timeupdate     | The time specified by the currentTime property changes.                                                                                                      | currentTime attribute has changed. |
| volumechange   | The volume changes.                                                                                                                                          |
| waiting        | Playing has stopped due to lack of data.                                                                                                                     |
| play           | Playback has started.                                                                                                                                        |
| playing        | After a pause or delay due to lack of data, playback is ready to begin.                                                                                      |
| pause          | Play is paused.                                                                                                                                              |
| volume         | The volume changes.                                                                                                                                          |
| fullscreen     | Triggers a full-screen event                                                                                                                                 |
