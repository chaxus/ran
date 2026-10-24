# Six actual playback paths

This checkpoint exercises native MP4, HLS, DASH, FLV, TS and local WHEP with real media decoding. Each recorded path advanced currentTime and decoded frames; teardown removed the player and released its media ownership. The WHEP path also verified DELETE and srcObject cleanup. The observations contain native runtime values, response hashes and recording identities; the source-input receipt still matches the relevant Player and theme files.

These are local fixtures. WHEP uses real peer connections/RTP, with the VPN host candidate normalized to loopback; it does not establish external TURN/NAT interoperability. DRM, ABR, live playlists, casting/PiP hardware and arbitrary codecs remain outside this evidence. Later demo media initialization and unrelated Loading variant changes do not alter these successful playback paths.
