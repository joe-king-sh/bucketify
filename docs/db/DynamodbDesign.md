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
| 1   | AudioMetaData | getAudioFilesByUserId |
| 2   | AudioMetaData | getAudioFilesByUserIdByAudioId |
| 3   | AudioMetaData | getAudioFilesByUserIdByArtist |
| 4   | AudioMetaData | getAudioFilesByUserIdByAlbum |
| 5   | AudioMetaData | getAudioFilesByUserIdBySSbucketName |
| 6   | AudioMetaData | getArtistByUserId |
| 7   | AudioMetaData | getAlbumByUserId |
| 8   | PlayList | getPlaylistByUserId |

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
| **UserId** | **AudioS3Path** | **Artist** | **Album** | **SSbucketName** | **AlbumArtWorkS3Path** | **AudioFileName** | **AccessKey** | **SecretAccessKey** |
| a@abc.com | s3://mybucket/aaa.mp3 | AC/DC | AlbumA | s3://mybucket/aaa.png | aaa | mybucket | AIJIJIGRXXX | jiAJFIadfgji|
| b@abc.com | s3://mybucket/bbb.mp3 | B | AlbumB | s3://mybucket/bbb.png | bbb | mybucket | AIJIJIGRYYY | yamARsdfagrea

##### Index
- LSI1
  Search by UserId and by Artist
    | LSI Partition Key || Projected Attributes|
    |---|---|---|
    | **LSI-1-PK,(Primary Table PK)** | **LSI-1-SK** | - |
    | **UserId** | **Artist** | ***RequiredColumns*** |
    |a@ab.com|AC/DC| {required columns} |
- LSI2
  Search by UserId and Album
- LSI3
  Search by UserId and S3BucketName

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
| {AudioS3Path} | UserId |{UserId}|
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
    | {UserId} | {AudioS3Path} | UserId |
    | {Artist} | {AudioS3Path} | Artist|
    | {Album} | {AudioS3Path} | Album |

**The Reason of not adopt**
Requirements can not be satisfied.
It is impossible when several users loading the same audio files.


### Option3(Adopted ✅ )
Using GSI Overloading,
#### AudioMetaData Table
##### Table
| PrimaryKey || Attributes||
|---|---|---|---|---|
| **PK,GSI-1-SK** | **SK,GSI-1-PK** | - | - | 
| **ID** | **DataType** | **DataValue1** | **DataValue2** |
| {AudioId} | UserId |{UserId}| - |
| {AudioId} | AudioS3Path |{UserId}-{AudioS3Path}| - |
| {AudioId} | AudioFileName |{UserId}-{AudioFileName}| - |
| {AudioId} | Artist |{UserId}-{Artist}| - |
| {AudioId} | Album |{UserId}-{Album}| - |
| {AudioId} | AlbumArtWorkS3Path |{AlbumArtWorkS3Path}| - |
| {AudioId} | AccessKey |{AccessKey}| - |
| {AudioId} | SecretAccessKey |{SecretAccessKey}| - |
| {AudioId} | PlayListIds | [{PlayListIds}] | - |

**Note**
Because the song name and album name may be same, 
should be use filter expression, after fetch datas.

##### Index
- GSI1

    | GSI Partition Key || Projected Attributes |
    |---|---|---|---|
    | **GSI-1-PK** | **GSI-1-SK** | **Primary Table SK** | 
    | **DataValue** | **ID** | **DataType** |
    | {UserId} | {AudioId} | UserId |
    | {UserId}-{AudioS3Path} | {AudioId} | AudioS3Path |
    | {UserId}-{Artist} | {AudioId} | Artist |
    | {UserId}-{Album} | {AudioId} | Album |

- GSI2



Neet one more index for search artist or album by useramail

#### PlayList Table
##### Table
| PrimaryKey | - | Attributes |||
|---|---|---|---|---|
| **PK** | - | - | - | 
| **ID** | **UserId** | **PlayListName** | **AudioId** | **SortOrder** |
| {PlayListId} | {} | {UserId} |


##### Index



## Query condition definition

##### Table
| # | Entity | Use Case | Parameters | Table/Index | API & Key Conditions |
|---|---|---|---|---|---|
| 1   | AudioMetaData | getAudioFilesByAudioId | {AuidioId} | Primary Table | Query(ID = :AudioId) |
| 2   | AudioMetaData | getAudioIdByUserId | {UserId} | GSI-1 | Query(DataValue = :UserId) |
| 3   | AudioMetaData | getAudioFilesByUserIdByArtist |
| 4   | AudioMetaData | getAudioFilesByUserIdByAlbum |
| 5   | AudioMetaData | getAudioFilesByUserIdBySSbucketName |
| 6   | AudioMetaData | getArtistByUserId |
| 7   | AudioMetaData | getAlbumByUserId |
| 8   | PlayList | getPlaylistByUserId |