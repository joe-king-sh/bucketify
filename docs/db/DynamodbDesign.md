# The design of data store using Dynamodb.

## ER Diagrams

![ER](./ER-diagrams.drawio.svg)

### Requirement
- Store user's metadata of audio in the 'AudioMetaData' table.
- Store user's play list in the 'PlayList' table.
- Users can access only their own data.

## Use case list
| #   | Entity        | Use Case     |
| --- | ------------- | ------------ |
| 1   | AudioMetaData | getAudioFiles |
| 2   | AudioMetaData | getAudioFilesByAudioS3Path |
| 3   | AudioMetaData | getAudioFilesByArtist |
| 4   | AudioMetaData | getAudioFilesByAlbum |
| 5   | AudioMetaData | getAudioFilesSSbucketName |
| 6   | AudioMetaData | getArtist |
| 7   | AudioMetaData | getAlbum |
| 8   | PlayList | getPlaylist |

**Note**
Users can access to only their audio metadata.

## Schema definition
### Option1(not adopted ❌ )
Like RDB + multiple GSI
#### AudioMetaData Table
##### Table
| PrimaryKey || Attributes|||||||
|---|---|---|---|---|---|---|---|---|
| **PK,LSI-1-PK,LSI-2-PK,LSI-3-PK** | **SK** | **LSI-1-SK** | **LSI-2-SK** | **LIST-3-SK** | -| -|- | -|
| **UserEmail** | **AudioS3Path** | **Artist** | **Album** | **SSbucketName** | **AlbumArtWorkS3Path** | **AudioFileName** | **AccessKey** | **SecretAccessKey** |
| a@abc.com | s3://mybucket/aaa.mp3 | AC/DC | AlbumA | s3://mybucket/aaa.png | aaa | mybucket | AIJIJIGRXXX | jiAJFIadfgji|
| b@abc.com | s3://mybucket/bbb.mp3 | B | AlbumB | s3://mybucket/bbb.png | bbb | mybucket | AIJIJIGRYYY | yamARsdfagrea

##### Index
- LSI1
  Search by UserEmail and by Artist
    | LSI Partition Key || Projected Attributes|
    |---|---|---|
    | **LSI-1-PK,(Primary Table PK)** | **LSI-1-SK** | - |
    | **UserEmail** | **Artist** | ***RequiredColumns*** |
    |a@ab.com|AC/DC| {required columns} |
- LSI2
  Search by UserEmail and Album
- LSI3
  Search by UserEmail and S3BucketName

**The Reason of not adopt**
Requirements can be satisfied,
but need to multiple index and too expensive for personal development.

### Option2(not adopted ❌ )
Using GSI Overloading
#### AudioMetaData Table
##### Table
| PrimaryKey || Attributes|
|---|---|---|---|
| **PK** | **SK** | **** | 
| **ID** | **DataType** | **DataValue** |
| {AudioS3Path} | UserEmail |{UserEmail}|
| {AudioS3Path} | AudioFileName |{AudioFileName}|
| {AudioS3Path} | Artist |{Artist}|
| {AudioS3Path} | Album |{Album}|
| {AudioS3Path} | AlbumArtWorkS3Path |{AlbumArtWorkS3Path}|
| {AudioS3Path} | AccessKey |{AccessKey}|
| {AudioS3Path} | SecretAccessKey |{SecretAccessKey}|
| {AudioS3Path} | PlayListIds | [{PlayListIds}] |

##### Index
- GSI1

    | GSI Partition Key || Projected Attributes|
    |---|---|---|---|
    | **GSI-1-PK** | **GSI-1-SK** | **Primary Table SK** | 
    | **DataValue** | **ID** | **DataType** |
    | {UserEmail} | {AudioS3Path} | UserEmail |
    | {Artist} | {AudioS3Path} | Artist|
    | {Album} | {AudioS3Path} | Album |

**The Reason of not adopt**
Requirements can not be satisfied.
It is impossible when several users loading the same audio files.


### Option3(Adopted ✅ )
Using GSI Overloading,
#### AudioMetaData Table
##### Table
| PrimaryKey || Attributes|
|---|---|---|---|
| **PK,GSI-1-SK** | **SK,GSI-1-PK** | - | 
| **ID** | **DataType** | **DataValue** |
| {AudioId} | UserEmail |{UserEmail}|
| {AudioId} | AudioS3Path |{UserEmail}-{AudioS3Path}|
| {AudioId} | AudioFileName |{UserEmail}-{AudioFileName}|
| {AudioId} | Artist |{UserEmail}-{Artist}|
| {AudioId} | Album |{UserEmail}-{Album}|
| {AudioId} | AlbumArtWorkS3Path |{AlbumArtWorkS3Path}|
| {AudioId} | AccessKey |{AccessKey}|
| {AudioId} | SecretAccessKey |{SecretAccessKey}|
| {AudioId} | PlayListIds | [{PlayListIds}] |

**Note**
Because the song name and album name may be same, 
should be use filter expression, after fetch datas.

##### Index
- GSI1

    | GSI Partition Key || Projected Attributes|
    |---|---|---|---|
    | **GSI-1-PK** | **GSI-1-SK** | **Primary Table SK** | 
    | **DataValue** | **ID** | **DataType** |
    | {UserEmail} | {AudioId} | UserEmail |
    | {UserEmail}-{AudioS3Path} | {AudioId} | AudioS3Path |
    | {UserEmail}-{Artist} | {AudioId} | Artist|
    | {UserEmail}-{Album} | {AudioId} | Album |

Neet one more index for search artist or album by useramail

#### PlayList Table
##### Table
| PrimaryKey |-| Attributes|
|---|---|---|---|
| **PK** | - |- | 
| **ID** | **DataType** | **DataValue** |
| {PlayListId} | {} |{UserEmail}|


##### Index



## Query condition definition